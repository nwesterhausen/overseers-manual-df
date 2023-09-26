// export function GenerateMaterialSearchString(material: SimpleMaterial): string {
//   let searchableTerms = [material.type];

//   searchableTerms = searchableTerms.concat(StatesIntoFlatArray(material.names));
//   searchableTerms = searchableTerms.concat(StatesIntoFlatArray(material.adjectives));
//   searchableTerms = searchableTerms.concat(StatesIntoFlatArray(material.colors));

//   searchableTerms = searchableTerms.concat(material.tags);
//   searchableTerms = searchableTerms.concat(material.syndromes);
//   searchableTerms = searchableTerms.concat(material.reactionClasses);

//   searchableTerms = searchableTerms.concat(Object.values(material.temperatures).map((t) => (t === 0 ? '' : `${t}`)));

//   return TransformIntoSearchTermString(searchableTerms);
// }
