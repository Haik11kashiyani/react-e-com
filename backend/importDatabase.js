import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Define the connection and backup paths
const MONGO_URI = 'mongodb://127.0.0.1:27017/db_techorbit';
const BACKUP_DIR = path.join(process.cwd(), '..', 'db_backup');

async function importDatabase() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB.');

        if (!fs.existsSync(BACKUP_DIR)) {
            console.error(`Backup directory not found at: ${BACKUP_DIR}`);
            process.exit(1);
        }

        const files = fs.readdirSync(BACKUP_DIR).filter(file => file.endsWith('.json'));
        console.log(`Found ${files.length} collections to import.`);

        for (let file of files) {
            const collectionName = path.parse(file).name;
            const filePath = path.join(BACKUP_DIR, file);
            
            const fileData = fs.readFileSync(filePath, 'utf8');
            const documents = JSON.parse(fileData);
            
            if (documents.length === 0) {
                console.log(`Skipped empty collection: ${collectionName}`);
                continue;
            }

            const collection = mongoose.connection.db.collection(collectionName);
            
            // Optional: Drop the collection if you want a clean import
            // try { await collection.drop(); } catch (e) {}

            await collection.insertMany(documents);
            console.log(`Imported collection: ${collectionName} (${documents.length} documents) from ${filePath}`);
        }

        console.log('\n✅ Full database import completed successfully!');

    } catch (error) {
        console.error('Error during database import:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

importDatabase();
