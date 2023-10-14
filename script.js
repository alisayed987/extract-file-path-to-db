const fs = require('fs');
const path = require('path');
// const mysql = require('mysql2');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'furniture',
});


async function extractDirectories(folderPaths) {
  if (folderPaths.length === 0) {
    return;
  }
  folderPaths.forEach(folderPath => {
    let folders = [];
    const data = fs.readdirSync(folderPath);
    data.map(async res => {
      let isFolder = fs.lstatSync(path.resolve(folderPath, res)).isDirectory();
      if (isFolder) {
        if (!res.endsWith(';')) {
          folders.push(path.resolve(folderPath, res))
          const table = res.split('-')[0];
          const name = res.split('-')[1];
          let tst = connection.query(`INSERT INTO ${table} (name) VALUES ("${name}");`)
          //   console.log('here',tst);
        } else {
          folders.push(path.resolve(folderPath, res))
        }
      }
    });
    extractDirectories(folders);
  });
}

async function extractFiles(folderPaths) {
  if (folderPaths.length === 0) {
    return;
  }
  folderPaths.forEach(folderPath => {
    let folders = [];
    const data = fs.readdirSync(folderPath);
    data.map(async res => {
      let isFolder = fs.lstatSync(path.resolve(folderPath, res)).isDirectory();
      if (isFolder) {
        folders.push(path.resolve(folderPath, res))
      } else {
        // save files in database
        let filePath = folderPath;

        let table = filePath.substr(filePath.lastIndexOf("\\") + 1).slice(0, -1);
        filePath = filePath.substr(0, filePath.lastIndexOf("\\"));

        const materialName = (filePath.substr(filePath.lastIndexOf("\\") + 1)).split('-')[1];
        let selectQuery = `SELECT * FROM materials Where name = "${materialName}" limit 1;`;
        connection.query(selectQuery, (error, selectResult) => {
          if (error) {
            console.error('Error retrieving data:', error);
          } else {
            let [rows] = selectResult;
            let materialId = rows.id;
            filePath = filePath.substr(0, filePath.lastIndexOf("\\"));

            switch (table) {
              case 'product_items':
                const categoryName = (filePath.substr(filePath.lastIndexOf("\\") + 1)).split('-')[1];
                let productQuery = `SELECT * FROM categories Where name = "${categoryName}" limit 1;`;
                connection.query(productQuery, (error, selectResult) => {
                  let [rows2] = selectResult;
                  let categoryId = rows2.id;
                  productQuery = `INSERT INTO ${table} (name, category_id, material_id) VALUES ("${path.resolve(folderPath, res)}", ${categoryId}, ${materialId});`;
                  connection.query(productQuery, (error, selectResult) => {
                    if (error) {
                      console.error('Error retrieving data:', error);
                    } else {
                      console.log('done')
                    }
                  })
                });
                break;
              case 'accessory_items':
                const accessoryTypeName = (filePath.substr(filePath.lastIndexOf("\\") + 1)).split('-')[1];
                let rawQuery = `SELECT * FROM accessory_item_types Where name = "${accessoryTypeName}" limit 1;`;
                connection.query(rawQuery, (error, selectResult) => {
                  let [rows2] = selectResult;
                  let accessoryTypeId = rows2.id;
                  rawQuery = `INSERT INTO ${table} (name, accessory_type_id, material_id) VALUES ("${path.resolve(folderPath, res)}", ${accessoryTypeId}, ${materialId});`;
                  connection.query(rawQuery, (error, selectResult) => {
                    if (error) {
                      console.error('Error retrieving data:', error);
                    } else {
                      console.log('done')
                    }
                  })
                });
                break;
            }
          }
        });
      }
    });
    extractFiles(folders);
  });
}

async function excuter() {
  connection.connect((err) => {
    if (err) throw err;
    console.log('connected');
  })
  await extractDirectories([path.resolve(__dirname, "start")])
  await extractFiles([path.resolve(__dirname, "start")])
}

excuter()


