const fs = require('fs');
const path = require('path');

class FileManager {
    constructor(filePath) {
        this.filePath = path.resolve(filePath);
    }

    save(data) {
        try {
            const jsonData = JSON.stringify(data, null, 4);
            fs.writeFileSync(this.filePath, jsonData, 'utf-8');
        } catch (error) {
            console.error(`Error saving data: ${error.message}`);
        }
    }

    load() {
        try {
            if (!fs.existsSync(this.filePath)) {
                const data = {
                    weekday: 1500,
                    weekend: 2000,
                    sauna: 100,
                    bonefire: 100,
                    specials: []
                };
                const jsonData = JSON.stringify(data, null, 4);
                fs.writeFileSync(this.filePath, jsonData, 'utf-8');
                return data;
            }
            const jsonData = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(jsonData);
        } catch (error) {
            console.error(`Error loading data: ${error.message}`);
            return null;
        }
    }
}

module.exports = FileManager;