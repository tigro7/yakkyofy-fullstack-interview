import mongoose, { Schema, Document } from 'mongoose';

interface IScreenshot extends Document {
    url: string;
    file?: Blob;
    status: 'queued' | 'processing' | 'done';
}

const ScreenshotSchema: Schema = new Schema({
    url: { type: String, required: true },
    file: { type: Blob},
    status: { type: String, 
        enum: ['queued', 'processing', 'done'],
        required: true,
        default: 'queued'
    }
});

const Screenshot = mongoose.model<IScreenshot>('Screenshot', ScreenshotSchema);

export default Screenshot;