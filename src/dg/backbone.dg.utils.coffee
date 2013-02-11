# ## Utilities

###
defaults

In the same idea of `_.defaults(object, *defaults)`, this function
will recurse the object structure to use defaults values at any
depth of the object.

@param {Object} object The objet to get the overriden values
@param {Object} defs Defaults to apply when no value is provided
@return {Object} Object enriched
###
defaults = (object, defs) ->
  # Empty object if none provided
  object = {} if object is undefined

  # For each pair of key/value from the defaults
  for key, value of defs
    # Check if the object key is defined or null
    if object[key] is undefined or object[key] == null
      object[key] = defs[key]

    # Check if the default and object value are objects
    else if _.isObject(defs[key]) and _.isObject(object[key])
      object[key] = defaults(object[key], defs[key])

  object

###
reject

Like `_.reject(list, iterator, [context])`, this function reject entries
that satisfies the iterator function.

@param {Object} object The objet that contains entries to reject
@param {Function} filter The function to reject unwanted entries
@return {Object} Object that contains only elements wanted
###
reject = (object, filter) ->
  newObject = {}

  # Check each key/value of the object
  for key, value of object
    # Keep entries only if filter is not satisfied
    unless filter(object, key, value)
      newObject[key] = value

  newObject

###
Check if the options given contains the options wanted

@param {Object} options The options to check
@param {Array(String)} optionNames The array of option names expected to be there
@return {Boolean} True if the options are correct, false otherwise
###
mandatoryOptions = (options, optionNames) ->
  # Check if the options exists and is an options hash
  unless options and _.isObject(options)
    return false

  for optionName in optionNames
    if options[optionName] is undefined
      return false

  return true