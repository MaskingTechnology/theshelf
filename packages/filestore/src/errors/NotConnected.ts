
import FileStoreError from './FileStoreError.js';

export default class NotConnected extends FileStoreError
{
    constructor(message?: string)
    {
        super(message ?? 'File store not connected');
    }
}
