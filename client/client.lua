local function toggleNuiFrame(shouldShow, windowId)
  SetNuiFocus(shouldShow, shouldShow)
  SendReactMessage('setVisible', { visible = shouldShow, windowId = windowId })
end

RegisterCommand('show-nui1', function()
  toggleNuiFrame(true, "window1")
  debugPrint('Show NUI frame 1')
end)

RegisterCommand('show-nui2', function()
  toggleNuiFrame(true, "window2")
  debugPrint('Show NUI frame 2')
end)

RegisterNUICallback('hideFrame', function(_, cb)
  toggleNuiFrame(false, nil) -- Cache toutes les fenêtres
  debugPrint('Hide NUI frame')
  cb({})
end)


RegisterNUICallback('TriggerUI1', function(data)
  print("This event was triggered in the 1st UI")
end)

RegisterNUICallback('TriggerUI2', function(data)
  print("This event was triggered in the 2nd UI")
end)