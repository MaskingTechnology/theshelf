
import FileStoreError from './FileStoreError.js';

export default class FileNotFound extends FileStoreError
{
    constructor(path?: string)
    {
        super(path ? `File not found: ${path}` : 'File not found');
    }
}
