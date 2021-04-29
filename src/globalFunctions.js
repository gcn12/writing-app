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
    if(projectID!==undefined) updateDatabaseFile(projectID, userID, timestamp)
    if(fileID) return updateDatabaseFile(fileID, userID, timestamp)
}

const updateDatabaseFile = (id, userID, timestamp) => {
    db.collection('users')
    .doc(userID)
    .collection('files-folders')
    .doc(id)
    .update({
        lastModified: timestamp
    })
    .catch((err)=> console.log(err))
}