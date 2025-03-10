package com.proto_app

import android.content.res.AssetFileDescriptor
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import org.tensorflow.lite.Interpreter
import java.io.File
import java.io.FileInputStream
import java.nio.MappedByteBuffer
import java.nio.channels.FileChannel

class TFLiteModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var interpreter: Interpreter? = null

    init {
        try {
            interpreter = Interpreter(loadModelFile("mobilefacenet.tflite"))
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun getName(): String {
        return "TFLiteModule"
    }

    // Load the model from the assets folder
    @Throws(Exception::class)
    private fun loadModelFile(modelFileName: String): MappedByteBuffer {
        val fileDescriptor: AssetFileDescriptor =
            reactApplicationContext.assets.openFd(modelFileName)
        val inputStream = FileInputStream(fileDescriptor.fileDescriptor)
        val fileChannel = inputStream.channel
        val startOffset = fileDescriptor.startOffset
        val declaredLength = fileDescriptor.declaredLength
        return fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength)
    }

    // Run the model on the image at the given path
    @ReactMethod
    fun runModelOnImage(imagePath: String, promise: Promise) {
        try {
            // Remove "file://" prefix if present
            val filePath = if (imagePath.startsWith("file://")) imagePath.substring(7) else imagePath
            
            // Check if the file exists
            val file = File(filePath)
            if (!file.exists()) {
                promise.reject("FileNotFound", "File does not exist at path: $filePath")
                return
            }
            
            // Load the image from file
            val bitmap = BitmapFactory.decodeFile(filePath)
            if (bitmap == null) {
                promise.reject("ImageError", "Failed to decode image at path: $filePath")
                return
            }
            
            // Resize bitmap to the model's expected input size (112x112 for MobileFaceNet)
            val resizedBitmap = Bitmap.createScaledBitmap(bitmap, 112, 112, false)
            
            // Preprocess the image: convert to a 4D float array [1, height, width, 3] with normalization
            val input = preprocessBitmap(resizedBitmap)
            
            // Create output array for the embedding vector (adjusted size 192 as per your model)
            val output = Array(1) { FloatArray(192) }
            
            // Run inference
            interpreter?.run(input, output)
            
            // Convert the float array output to a WritableArray
            val resultArray: WritableArray = Arguments.createArray()
            output[0].forEach { value ->
                resultArray.pushDouble(value.toDouble())
            }
            
            // Return the WritableArray to JS
            promise.resolve(resultArray)
        } catch (e: Exception) {
            promise.reject("InferenceError", e)
        }
    }

    // Preprocess the bitmap into a normalized float array
    private fun preprocessBitmap(bitmap: Bitmap): Array<Array<Array<FloatArray>>> {
        val width = bitmap.width
        val height = bitmap.height
        val input = Array(1) { Array(height) { Array(width) { FloatArray(3) } } }

        for (y in 0 until height) {
            for (x in 0 until width) {
                val pixel = bitmap.getPixel(x, y)
                // Extract RGB values (0-255)
                val r = ((pixel shr 16) and 0xFF).toFloat()
                val g = ((pixel shr 8) and 0xFF).toFloat()
                val b = (pixel and 0xFF).toFloat()
                // Normalize the pixel values (assuming model expects values between -1 and 1)
                input[0][y][x][0] = (r - 127.5f) / 127.5f
                input[0][y][x][1] = (g - 127.5f) / 127.5f
                input[0][y][x][2] = (b - 127.5f) / 127.5f
            }
        }
        return input
    }
}
