import filter from 'leo-profanity'

filter.loadDictionary()
filter.add(filter.getDictionary('ru'))

const cleanProfanity = text => filter.clean(text)

export default cleanProfanity
