var Router = require('../src/js/lib/router');

describe("ROUTER", function() {
    it("should be able to create instance", function() {
        var router = new Router(
            [{ route: '', controller: function(){} }], 
            function(){}
        );
        if(router.paths.length === 0) throw new Error("No paths registered");
    });
     it("should serialize routes", function() {
        var router = new Router(
            [{ route: '/test/<id:string>', controller: function(){} }], 
            function(){}
        );
        if('^#/test/(\\w+)$' !== router.paths[0].re) throw new Error("Paths not translating");
    });
});