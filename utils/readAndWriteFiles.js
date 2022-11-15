const fs = require('fs');

const getGenCode = async (whs,path,empNo) => {
    try {
        const postNumber = fs.readFileSync(path, 'utf8');
        return combineNumber(whs,postNumber,empNo)
    } catch (err) {
        console.log(err)
        const postNumber = '0'
        updateGenCode(postNumber,path)
        return getGenCode(whs,path,empNo)
    }
}

const previousGetGenCode = async (whs,path,empNo) => {
    try {
        let postNumber = fs.readFileSync(path, 'utf8');
        postNumber = parseInt(postNumber) - 1
        postNumber = postNumber.toString()
        return combineNumber(whs,postNumber,empNo)
    } catch (err) {
        console.log(err)
    }
}

const updateGenCode = async (postNumber,path) => {
    const number = updatePostNumber(postNumber)
    try {
        fs.writeFileSync(path, number);
        return 'updated'
    } catch (err) {
        console.error(err);
        return 'file error'
    }
}

const combineNumber = (whs,postNumber,empNo) => {
    return whs + "-" + empNo + "-" + postNumber

}

const updatePostNumber = (postNumber) => {
    let no = parseInt(postNumber);
    no += 1;
    return no.toString()
}

const getPostNo = async (path) => {
    try {
        const postNumber = fs.readFileSync(path, 'utf8');
        return postNumber
    } catch (err) {
        console.log(err)
        return 'file error'
    }
}

const addMatchingFile = async (file,whs) => {
    const data = JSON.stringify(file);
    try {
        fs.writeFileSync(`./${whs}/matching.txt`, data);
        return 'added'
    } catch (err) {
        console.error(err);
        return 'file error'
    }
}

const getMatchingFile = async(whs) => {
    try {
        const file = fs.readFileSync(`./${whs}/matching.txt`, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            }
            return JSON.parse(data.toString());
        });
        return file
    } catch (err) {
        console.log(err)
        return 'file error'
    }
}

const addLabel = async (file,whs) => {
    try {
        fs.writeFileSync(`./${whs}/label.txt`, file);
        return 'added'
    } catch (err) {
        console.error(err);
        return 'file error'
    }
}

const getlabel = async(whs) => {
    try {
        const file = fs.readFileSync(`./${whs}/label.txt`, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            }
            return data
        });
        return file
    } catch (err) {
        console.log(err)
        return 'file error'
    }
}

module.exports = {
    getGenCode,
    getPostNo,
    updateGenCode,
    previousGetGenCode,
    addMatchingFile,
    getMatchingFile,
    addLabel,
    getlabel
}
