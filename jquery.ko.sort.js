function jqkosort( list, id ) {
    var self = this;

    /***********************************************/
    //Properties

    self.list = list;
    self.id = id;

    self.lastIdx = null;
    self.columnnames = [];
    self.sortdirection = [];
    self.valueType = [];

    /***********************************************/
    //General Functions
    
    self.asc = function(l, r) {
        return l == r ? 0 : (l < r ? -1 : 1);
    }
    self.desc = function(l, r) {
        return l == r ? 0 : (l > r ? -1 : 1);
    }
    
    self.reset = function() {
        self.sortdirection = [];
    }

    self.getTextElement = function( string ) {
        var value = null;
        var list = string.split( ";" );
        
        list.forEach( function(el) {
                     var myRegexp = /text\s*:\s*(.*)/;
                     var match = myRegexp.exec(el);
                     if ( match != null ) {
                     value = match[1];
                     }
                     });
        return value;
    }
    
    /***********************************************/
    //Sort Functions
    
    self.applyCss = function() {
        $( self.id + " th" ).removeClass( "headerSortDown" );
        $( self.id + " th" ).removeClass( "headerSortUp" );
        if ( self.sortdirection[self.lastIdx] == self.asc ) {
            $( $( self.id + " th" )[self.lastIdx] ).addClass( "headerSortUp" );
        } else {
            $( $( self.id + " th" )[self.lastIdx] ).addClass( "headerSortDown" );
        }
        
    }

    self.applySort = function() {
        columnName = self.columnnames[self.lastIdx];
        list.sort( function(left, right) {
                  
                  l = self.valueType[self.lastIdx]( left[columnName]() );
                  r = self.valueType[self.lastIdx]( right[columnName]() );
                  
                  result = self.sortdirection[self.lastIdx](l,r);
                  return result
                  })
    }

    //* Apply the Sort
    self.apply = function(idx) {
        self.sortdirection[idx] = ( idx >= self.sortdirection.length ) ? self.asc: ( idx != self.lastIdx ) ? self.asc : ( self.sortdirection[idx] == self.asc ) ? self.desc : self.asc;
        self.lastIdx = idx;
        
        self.applyCss();
        self.applySort();
        
    }
    
    /***********************************************/
    //Setup Functions
    
    self.processColumn = function(i) {
        var el = $(headers[i]);
        
        //get the name of the text element to which the current column has been bound
        self.columnnames[i] = self.getTextElement( el[0].attributes.getNamedItem( "data-bind" ).nodeValue );

        if ( el.hasClass( "number" ) ) {
            self.valueType[i] = Number;
        } else if ( el.hasClass( "date" ) ) {
            self.valueType[i] = function(string) { return new Date(string).getTime(); };
        } else {
            alert( "Type Not Supported" );
        }
    }

    self.processColumns = function() {
        headers = $( self.id + " tbody td");

        for( var i=0;i<headers.length;i++ ) {
            self.processColumn(i);
            
        }
    }
    
    self.init = function() {
        self.processColumns();
        
        $( self.id + " th" ).bind( "click", function(event) {
                             self.apply( event.currentTarget.cellIndex );
                             })
        
    }
    
    self.init();
    
}

