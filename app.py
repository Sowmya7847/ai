from flask import Flask, request, jsonify
from transformers import VisionEncoderDecoderModel, ViTImageProcessor, AutoTokenizer
import torch
from PIL import Image

app = Flask(__name__)

# Load the model and tokenizer
model = VisionEncoderDecoderModel.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
feature_extractor = ViTImageProcessor.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
tokenizer = AutoTokenizer.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

max_length = 16
num_beams = 4
gen_kwargs = {"max_length": max_length, "num_beams": num_beams}

def predict_caption(image):
    if image.mode != "RGB":
        image = image.convert(mode="RGB")
    inputs = feature_extractor(images=[image], return_tensors="pt")
    pixel_values = inputs.pixel_values.to(device)
    attention_mask = torch.ones(pixel_values.shape[:2], device=device)
    output_ids = model.generate(pixel_values, attention_mask=attention_mask, **gen_kwargs)
    preds = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    return preds.strip()

@app.route('/generate_caption', methods=['POST'])
def generate_caption():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    image = Image.open(request.files['image'])
    caption = predict_caption(image)
    return jsonify({'caption': caption})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
