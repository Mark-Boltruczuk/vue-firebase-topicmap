export const getObject = function (container, id, parent, child, callback) {
    if (container.id === id) {
        callback(container, child)
    } else if (container.children) {
        var children
        for (var i = 0; i < container.children.length; i++) {
            var item = container.children[i]
            if (parent) {
                if (item.id === id) {
                    callback(container, child)
                } else {
                    children = child + '/children/' + i
                    getObject(item, id, parent, children, callback)
                }
            } else {
                children = child + '/children/' + i
                getObject(item, id, parent, children, callback)
            }
        }
    }
}

export const findObject = function (container, id, callback) {
    if (container.id === id) {
        callback(container)
        return
    } else if (container.children) {
        for (var key in container.children) {
            findObject(container.children[key], id, callback)
        }
        return
    }
}

export const getIndex = function (container, id) {
    for (var i = 0; i < container.length; i++) {
        if (container[i].id == id) {
            return i
        }
    }
}