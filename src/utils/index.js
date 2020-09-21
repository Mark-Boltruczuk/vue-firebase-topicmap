export const getObject = function (container, id, parent, child, callback) {
    if (container.id === id) {
        callback(container, child)
    } else if (container.children) {
        var children
        for (var i = 0; i < container.children.length; i++) {
            var item = container.children[i]
            if (parent) {   // retrieve parent id to add topic
                if (item.id === id) {
                    callback(container, child)
                } else {
                    children = child + '/children/' + i
                    getObject(item, id, parent, children, callback)
                }
            } else {    //retrieve select id to edit topic
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

export const uid = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
}