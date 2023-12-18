export  default {
   isImage : (fileType) => {
    if (!fileType) {
      fileType = ''
    }
    fileType = fileType.toLowerCase()
    if (/png|jpg|jpeg|svg|gif|bmp/.test(fileType)) {
      return true
    }
    return false
  },
   isVideo : (fileType) => {
    if (!fileType) {
      fileType = ''
    }
    fileType = fileType.toLowerCase()
    if (/mp4|webm|ogv|ogg/.test(fileType)) {
      return true
    }
    return false
  },
   isText : (fileType) => {
    if (!fileType) {
      fileType = ''
    }
    fileType = fileType.toLowerCase()
    if (/txt|log|java|sql|sh|bat|js|html|vue|xml|json|yaml/.test(fileType)) {
      return true
    }
    return false
  }

}
