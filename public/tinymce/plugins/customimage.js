(function () {
  var PluginManager = window.tinymce.util.Tools.resolve('tinymce.PluginManager')

  function commandRegister (editor) {
    editor.addCommand('mceImageUpload', function() {
      // 对外暴露点击回调
      editor.settings.customImageCallback()
    })
  }

  function componentRegister (editor) {
    editor.ui.registry.addButton('customimage', {
      icon: 'image',
      tooltip: '上传图片',
      onAction: function() {
        editor.execCommand('mceImageUpload')
      }
    })
  }

  PluginManager.add('customimage', function(editor) {
    componentRegister(editor)
    commandRegister(editor)
  })

  function Plugin () {
    // ...
  }

  return Plugin
})()
