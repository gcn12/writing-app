import { db } from './firebase'

export const generateID = () => {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for ( let i = 0; i < 12; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

export const updateLastModified = (userID, projectID, fileID) => {
    const timestamp = Date.now()
    const ref = db.collection('users')
    .doc(userID)

    if(projectID) {
        ref.collection('projects')
        .doc(projectID)
        .update({
            lastModified: timestamp
        })
        .then(()=> {
            console.log('updated')
        })
        .catch((err)=> {
            console.log(err)
        })
    }
    if(fileID) {
        ref.collection('file-previews')
        .doc(fileID)
        .update({
            lastModified: timestamp
        })
        .then(()=> {
            console.log('updated')
        })
        .catch((err)=> {
            console.log(err)
        })
    }

}