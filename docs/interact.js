
loadInteract();

function loadInteract () {

  function dragMoveListener (event) {
      var target = event.target
      // keep the dragged position in the data-x/data-y attributes
      var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
      var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
    
      // translate the element
      target.style.webkitTransform =
        target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)'
    
      // update the posiion attributes
      target.setAttribute('data-x', x)
      target.setAttribute('data-y', y)
    }

  function dragTokenMoveListener (event) {
    var target = event.target
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

    // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)

    id = target.getAttribute('tokenid');
    index = -1;
    for (let i in app.tokens) {
      if (app.tokens[i].id == id) {
        index = i;
      }
    }
    app.selectedToken = id;

    app.tokens[index].x = x;
    app.tokens[index].y = y;
    app.updateSelectedToken();
  }

  interact('#background-image')
    .resizable({
      // resize from all edges and corners
      edges: { left: true, right: true, bottom: true, top: true },

      listeners: {
        move (event) {
          var target = event.target
          var x = (parseFloat(target.getAttribute('data-x')) || 0)
          var y = (parseFloat(target.getAttribute('data-y')) || 0)

          // update the element's style
          //target.style.width = event.rect.width + 'px'
          //target.style.height = event.rect.height + 'px'


          // translate when resizing from top or left edges
          x += event.deltaRect.left
          y += event.deltaRect.top

          //target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

          target.setAttribute('data-x', x)
          target.setAttribute('data-y', y)

          app.background.width = event.rect.width;
          app.background.height = event.rect.height;
        }
      },
      modifiers: [
        interact.modifiers.aspectRatio({
          // make sure the width is always double the height
          ratio: 'preserve',
          // also restrict the size by nesting another modifier
        }),
        // minimum size
        interact.modifiers.restrictSize({
          min: { width: 300, height: 300 },
          max: {width: 2000, height: 2000}
        })
      ],

      inertia: true
    })


  interact('.token')
    .draggable({
      inertia: false,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true
        }),
        interact.modifiers.snap({
          targets: [
            interact.snappers.grid({ 
              x: app.grid.width,
              y: app.grid.height,
              offset: { x: app.grid.offsetx, y: app.grid.offsety }
            })
          ],
          range: Infinity,
          relativePoints: [ { x: 0, y: 0 } ]
        })
      ],
      autoScroll: true,
      // dragMoveListener from the dragging demo above
      listeners: { move: dragTokenMoveListener }
    })

    .resizable({
      // resize from all edges and corners
      edges: { left: true, right: true, bottom: true, top: true },

      listeners: {
        move (event) {
          var target = event.target
          var x = (parseFloat(target.getAttribute('data-x')) || 0)
          var y = (parseFloat(target.getAttribute('data-y')) || 0)

          // translate when resizing from top or left edges
          x += event.deltaRect.left
          y += event.deltaRect.top

          target.style.transform = target.style.transform + 'rotate(0deg)';
          target.style.webkitTransform = target.style.webkitTransform + 'rotate(0deg)';

          target.setAttribute('data-x', x)
          target.setAttribute('data-y', y)

          id = target.getAttribute('tokenid');
          index = -1;
          for (let i in app.tokens) {
            if (app.tokens[i].id == id) {
              index = i;
            }
          }
          app.selectedToken = id;

          app.tokens[index].x = x;
          app.tokens[index].y = y;
          app.tokens[index].width = event.rect.width;
          app.tokens[index].height = event.rect.height;
          app.updateSelectedToken();
        }
      },
      modifiers: [
        // keep the edges inside the parent
        interact.modifiers.restrictEdges({
          outer: 'parent'
        }),

        // minimum size
        interact.modifiers.restrictSize({
          min: { width: 30, height: 30 },
          max: {width: 1000, height: 1000}
        })
      ],

      inertia: true
    })

}