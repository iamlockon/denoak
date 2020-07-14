import { Schema as T } from "../../dep.ts"

export const addExample = async () => {

}

export const exampleValidator = () => {

}

// Define schema here

const ExampleSchema = T({
  content: T.string.trim().normalize().optional()
});