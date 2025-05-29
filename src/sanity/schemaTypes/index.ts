import { type SchemaTypeDefinition } from 'sanity'
import { categoryType } from './categoryType'
import {clientType} from './clientType'
import { projectType } from './ProjectType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [categoryType,clientType,projectType],
}
