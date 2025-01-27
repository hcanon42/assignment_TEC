import YAML from 'yaml'

/**
 * Loads a YAML file and converts it into a JSON object.
 * @returns A promise resolving to the parsed JSON object.
 */
export async function loadYamlAsJson<T>(): Promise<T> {
  const yamlDataFilePath = '/data/data.yml'

  try {
    // Fetch the YAML file
    const response = await fetch(yamlDataFilePath)

    if (!response.ok) {
      throw new Error(`Failed to load file at ${yamlDataFilePath}: ${response.statusText}`)
    }

    // Parse the YAML content
    const yamlText = await response.text()
    const jsonObject = YAML.parse(yamlText)
    return jsonObject as T
  } catch (error) {
    console.error(`Error loading or parsing YAML file: ${error}`)
    throw error
  }
}
