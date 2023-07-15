const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');

  function runScript() {
    fs.readFile('./run/data.json', 'utf8', (err, content) => {
        if (err) {
          console.error('Dosya okuma hatası:', err);
          return;
        }
        const jsonData = JSON.parse(content);
        console.log('Okunan JSON objesi:', jsonData);
        if (jsonData.length > 0) {
          runCommands(jsonData);
        } else {
            return;
        }
      });    
  }

async function runCommands(commands) {
  for (const command of commands) {
    console.log(`"${command}" komutu yürütülüyor...`);

    const execPromise = promisify(exec);
    try {
      const { stdout, stderr } = await execPromise(command);
      console.log(`Çıktı:\n${stdout}`);
    } catch (error) {
      console.error(`Hata oluştu: ${error.message}`);
    }
  }

  console.log('Tüm komutlar tamamlandı.');
}

module.exports = {runScript}

// Komutları yürütme işlemini başlat