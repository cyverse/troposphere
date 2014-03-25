define(['collections/base', 'models/machine'], function(Base, Machine) {
    return Base.extend({
        model: Machine,
    });
});
