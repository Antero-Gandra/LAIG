Ext.data.JsonP.CGFapplication({"tagname":"class","name":"CGFapplication","autodetected":{},"files":[{"filename":"CGFapplication.js","href":null}],"members":[{"name":"constructor","tagname":"method","owner":"CGFapplication","id":"method-constructor","meta":{}},{"name":"init","tagname":"method","owner":"CGFapplication","id":"method-init","meta":{}},{"name":"initInterface","tagname":"method","owner":"CGFapplication","id":"method-initInterface","meta":{"private":true}},{"name":"initScene","tagname":"method","owner":"CGFapplication","id":"method-initScene","meta":{"private":true}},{"name":"resizeCanvas","tagname":"method","owner":"CGFapplication","id":"method-resizeCanvas","meta":{"private":true}},{"name":"run","tagname":"method","owner":"CGFapplication","id":"method-run","meta":{}},{"name":"setInterface","tagname":"method","owner":"CGFapplication","id":"method-setInterface","meta":{}},{"name":"setScene","tagname":"method","owner":"CGFapplication","id":"method-setScene","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-CGFapplication","classIcon":"icon-class","superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><div class='doc-contents'>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CGFapplication'>CGFapplication</span><br/></div><strong class='new-keyword'>new</strong><a href='#!/api/CGFapplication-method-constructor' class='name expandable'>CGFapplication</a>( <span class='pre'>element</span> ) : <a href=\"#!/api/CGFapplication\" rel=\"CGFapplication\" class=\"docClass\">CGFapplication</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Creates a new application bound to an HTML element, and manages application's life cycle ...</div><div class='long'><p>Creates a new application bound to an HTML element, and manages application's life cycle</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : HTMLElement<div class='sub-desc'><p>A reference to the HTML element in which the WebGL canvas will be included.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/CGFapplication\" rel=\"CGFapplication\" class=\"docClass\">CGFapplication</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-init' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CGFapplication'>CGFapplication</span><br/></div><a href='#!/api/CGFapplication-method-init' class='name expandable'>init</a>( <span class='pre'></span> ) : boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Initializes the WebGL context, as well as the ssociated instances of CGFscene and CGFinterface. ...</div><div class='long'><p>Initializes the WebGL context, as well as the ssociated instances of CGFscene and CGFinterface.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-initInterface' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CGFapplication'>CGFapplication</span><br/></div><a href='#!/api/CGFapplication-method-initInterface' class='name expandable'>initInterface</a>( <span class='pre'></span> ) : boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Initializes the interface previously bound by setInterface ...</div><div class='long'><p>Initializes the interface previously bound by <a href=\"#!/api/CGFapplication-method-setInterface\" rel=\"CGFapplication-method-setInterface\" class=\"docClass\">setInterface</a></p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-initScene' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CGFapplication'>CGFapplication</span><br/></div><a href='#!/api/CGFapplication-method-initScene' class='name expandable'>initScene</a>( <span class='pre'></span> ) : boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Initializes the scene previously bound by setScene ...</div><div class='long'><p>Initializes the scene previously bound by <a href=\"#!/api/CGFapplication-method-setScene\" rel=\"CGFapplication-method-setScene\" class=\"docClass\">setScene</a></p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-resizeCanvas' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CGFapplication'>CGFapplication</span><br/></div><a href='#!/api/CGFapplication-method-resizeCanvas' class='name expandable'>resizeCanvas</a>( <span class='pre'>gl</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Handles changes in the shape and size of the canvas e.g. ...</div><div class='long'><p>Handles changes in the shape and size of the canvas e.g. when the browser's window is resized.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>gl</span> : WebGLRenderingContext<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-run' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CGFapplication'>CGFapplication</span><br/></div><a href='#!/api/CGFapplication-method-run' class='name expandable'>run</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Starts the application loop, after all has been initialized. ...</div><div class='long'><p>Starts the application loop, after all has been initialized.</p>\n</div></div></div><div id='method-setInterface' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CGFapplication'>CGFapplication</span><br/></div><a href='#!/api/CGFapplication-method-setInterface' class='name expandable'>setInterface</a>( <span class='pre'>iFace</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Makes an interface the active interface of this application ...</div><div class='long'><p>Makes an interface the active interface of this application</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>iFace</span> : <a href=\"#!/api/CGFinterface\" rel=\"CGFinterface\" class=\"docClass\">CGFinterface</a><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-setScene' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CGFapplication'>CGFapplication</span><br/></div><a href='#!/api/CGFapplication-method-setScene' class='name expandable'>setScene</a>( <span class='pre'>scene</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Makes a scene the active scene of this application ...</div><div class='long'><p>Makes a scene the active scene of this application</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>scene</span> : <a href=\"#!/api/CGFscene\" rel=\"CGFscene\" class=\"docClass\">CGFscene</a><div class='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});