from flask import Flask, request, jsonify
import cv2
from keras.layers import Input, Conv2D, MaxPooling2D, Dropout, Flatten, Dense
from keras.models import Model
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

uniq_labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'del', 'nothing', 'space']

def load_model():
    input_shape = (64, 64, 3)

    input_layer = Input(shape=input_shape)
    x = Conv2D(filters=64, kernel_size=5, padding='same', activation='relu')(input_layer)
    x = Conv2D(filters=64, kernel_size=5, padding='same', activation='relu')(x)
    x = MaxPooling2D(pool_size=(4, 4))(x)
    x = Dropout(0.5)(x) #prevents overfitting
    x = Conv2D(filters=128, kernel_size=5, padding='same', activation='relu')(x)
    x = Conv2D(filters=128, kernel_size=5, padding='same', activation='relu')(x)
    x = MaxPooling2D(pool_size=(4, 4))(x)
    x = Dropout(0.5)(x)
    x = Conv2D(filters=256, kernel_size=5, padding='same', activation='relu')(x)
    x = Dropout(0.5)(x)
    x = Flatten()(x)
    output_layer = Dense(29, activation='softmax')(x)

    model = Model(inputs=input_layer, outputs=output_layer)

    return model

model = load_model()
model.load_weights("../ASL_model.weights.h5")

@app.route('/predict', methods=['POST'])
def predict():
    # Check if any image files are sent in the request
    if not request.files:
        return jsonify({'error': 'No images provided'}), 400

    predictions = []

    # Iterate over the keys to handle each image individually
    for key in request.files:
        image_file = request.files[key]

        # Read the image file as an array
        image_array = cv2.imdecode(np.frombuffer(image_file.read(), np.uint8), cv2.IMREAD_COLOR)

        # Resize the image to (64, 64)
        resized_image = cv2.resize(image_array, (64, 64))

        # Preprocess the image (if needed)
        # For example, you may need to normalize pixel values or convert to grayscale

        # Reshape the image to match model input shape (if needed)
        X = np.expand_dims(resized_image, axis=0)

        # Make predictions
        prediction = model.predict(X)

        # Convert prediction to label
        predicted_label = uniq_labels[np.argmax(prediction)]

        # Append prediction to list
        predictions.append(predicted_label)

    return jsonify({'predictions': predictions})

if __name__ == '__main__':
    app.run(debug=True)
