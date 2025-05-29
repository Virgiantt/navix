import { type SchemaTypeDefinition } from 'sanity'
import { categoryType } from './categoryType'
import {clientType} from './clientType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [categoryType,clientType],
}
