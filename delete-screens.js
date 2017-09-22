const fs = require('fs')


function deleteScreens(screens) {
  screens.forEach(s => fs.unlinkSync(s.img))
}

module.exports = deleteScreens