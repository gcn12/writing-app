import { db } from '../../../firebase'

export const saveScreenplay = (scriptObject, userID, scriptID) => {
    db.collection('users')
    .doc(userID)
    .collection('files')
    .doc(scriptID)
    .update({
        text: scriptObject
    })
}