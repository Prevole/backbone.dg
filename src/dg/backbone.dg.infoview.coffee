###
## Dg.InfoView

Default implementation to present general information about the collection
currently displayed.

The following information are shown:

  - from: The number of the first entry shown
  - to: The number of the last entry shown
  - total: The total number of entries shown

A translation is done for the message shown through `I18n-js` if present. Otherwise,
the default message is used:

  - default message: `Showing ${from} to ${to} of ${total} entries`
###
Dg.InfoView = class extends Dg.DefaultItemView
  template: templates["info"]

  ###
  Show the metadata that describes the collection currently shown
  to the user such the number of entries, the first record, the last
  record.

  @param {Object} info The metadata to collect the data to show
  ###
  refreshView: (info) ->
    # Check if the I18n library is used
    if isI18n()
      @$el.text I18n.t(i18nKeys.info, {from: info[infoKeys.from], to: info[infoKeys.to], total: info[infoKeys.items]})
    else
      @$el.text "Showing #{info[infoKeys.from]} to #{info[infoKeys.to]} of #{info[infoKeys.items]} entries"
