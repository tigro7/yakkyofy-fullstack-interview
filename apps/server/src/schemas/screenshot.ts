import mongoose, { Schema, Document } from 'mongoose';

interface IScreenshot extends Document {
    url: string;
    file?: Buffer;
    status: 'queued' | 'processing' | 'done';
}

const ScreenshotSchema: Schema = new Schema({
    url: { type: String, required: true },
    file: { type: Buffer},
    status: { type: String, 
        enum: ['queued', 'processing', 'done'],
        required: true,
        default: 'queued'
    }
});

const Screenshot = mongoose.model<IScreenshot>('screenshots', ScreenshotSchema);

export default Screenshot;