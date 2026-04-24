import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Define the connection and backup paths
const MONGO_URI = 'mongodb://127.0.0.1:27017/db_techorbit';
const BACKUP_DIR = path.join(process.cwd(), '..', 'db_backup');

async function exportDatabase() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB.');

        // Create backup directory if it doesn't exist
        if (!fs.existsSync(BACKUP_DIR)) {
            fs.mkdirSync(BACKUP_DIR, { recursive: true });
        }

        // Get all collections
        const collections = await mongoose.connection.db.collections();
        console.log(`Found ${collections.length} collections.`);

        for (let collection of collections) {
            const collectionName = collection.collectionName;
            
            // Skip system collections
            if (collectionName.startsWith('system.')) continue;

            const documents = await collection.find({}).toArray();
            
            // Write to JSON file
            const filePath = path.join(BACKUP_DIR, `${collectionName}.json`);
            fs.writeFileSync(filePath, JSON.stringify(documents, null, 2));
            console.log(`Exported collection: ${collectionName} (${documents.length} documents) -> ${filePath}`);
        }

        console.log('\n✅ Full database backup completed successfully!');
        console.log(`📂 Your backup files are saved in: ${BACKUP_DIR}`);
        console.log('You can now zip the "e-com" folder and share it with your friend.');

    } catch (error) {
        console.error('Error during database export:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

exportDatabase();
