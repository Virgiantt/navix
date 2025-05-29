import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Navix agency')
    .items([

      S.documentTypeListItem('category').title('Categories'),

      S.divider(),
      
     
      // Exclude 'category' from the list of document types
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['category'].includes(item.getId()!)
      ),

      // Add any additional items or custom views here
    ]
  )
