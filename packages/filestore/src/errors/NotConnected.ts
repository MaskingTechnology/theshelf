
import FileStoreError from './FileStoreError.js';

export default class NotConnected extends FileStoreError
{
    constructor()
    {
        super('File store not connected');
    }
}
