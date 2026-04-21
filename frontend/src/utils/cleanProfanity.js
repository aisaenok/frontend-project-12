import filter from 'leo-profanity'

filter.loadDictionary('ru')

const cleanProfanity = text => filter.clean(text)

export default cleanProfanity
