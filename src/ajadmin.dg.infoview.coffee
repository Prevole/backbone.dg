# Default implementation to present general information about the collection
# currently displayed.
#
# The following information are shown:
#   - from: The number of the first entry shown
#   - to: The number of the last entry shown
#   - total: The total number of entries shown
#
# A translation is done for the message shown through I18n-js if present. Otherwise,
# the default message is used:
#   - default message: "Showing ${from} to ${to} of ${total} entries
Dg.InfoView = class extends Dg.DefaultItemView
  template: templates["info"]

  # Show the message to tell the number of entries shown regarding
  # the filtering and so on.
  refreshView: (info) ->
    # Check if the I18n library is used
  # TODO: Check how to do that
#    if I18n is undefined
     @$el.text "Showing #{info[infoKeys.from]} to #{info[infoKeys.to]} of #{info[infoKeys.items]} entries"
#    else
#     @$el.text I18n.t(i18nKeys.info, {from: info[infoKeys.from], to: info[infoKeys.to], total: info[infoKeys.items]})
