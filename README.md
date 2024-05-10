

https://github.com/ye-bhee-theek-ha/Gesture_guide/assets/88560890/fd60e955-0ef2-497e-83fc-03f86d4fbad7


this app lets you upload the hand sign as a JPG image converts it into a 64 by 64 array of pixels then passes it into a Deep learning model which outputs the the correct label.


Model:
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
