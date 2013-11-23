var viewer;
$(document).ready(function() {
    viewer = new Viewer($('.legal-code').get(0),$('#law_menu').get(0));
    var base_clause = $('.legal-code').attr('data-base-clause');
    $.ajax({
        url: '/sfmuni.json' + (base_clause ? '?base=' + base_clause : ''),
        dataType: 'JSON',
        success: function(data) {
            viewer.setTitle(data.title);
            viewer.addTree(data.content);
        }
    });
});

var Viewer = function(parentEl, menuEl) {
    this.clauseTemplate = _.template($('#clauseTemplate').html());
    this.parentEl = parentEl;
    this.menuEl = menuEl;
    this.setUIHandlers();

    this.searchIndex = lunr(function () {
        this.field('item');
        this.field('text');
        this.ref('id');
    });
};

Viewer.prototype.setTitle = function(title) {
    // TODO
}

Viewer.prototype.setUIHandlers = function() {
    var that = this;
    $('#index-mode-btn').on('click', function() {
        $(that.parentEl).addClass('index-mode');
        $('#index-mode-btn').hide();
        $('#full-mode-btn').show();

        // Clear out all collapsed clauses
        $('.collapsed').removeClass('collapsed');
        // $(this.menuEl).show();
        // $('#menu_btn').hide();
    });

    $('#full-mode-btn').on('click', function() {
        $(that.parentEl).removeClass('index-mode');
        $('#index-mode-btn').show();
        $('#full-mode-btn').hide();
        // $(this.menuEl).show();
        // $('#menu_btn').hide();
    });

    // Uncollapse sections in index mode
    $(this.parentEl).on('click', '.clause[data-heading="section"]', function() {
        if ($(that.parentEl).hasClass('index-mode')) {
            $(this).addClass('collapsed');
        }
    });

    // Set up popover for Amendments
    $(this.parentEl).popover({
        selector: '[rel="amendment"]'
    });
};

// Renders node to a DOM element and adds it as a child to parentEl.
// Returns parent element for children
Viewer.prototype.renderNode = function(node, parentEl) {
    var $clause = $(this.clauseTemplate({tree: node}));
    $(parentEl).append($clause);
    var $children = $clause.find('.clause-children');
    return $children;
}

Viewer.prototype.addTree = function(tree, parentEl) {
    if (tree instanceof Array) {
        for (var i=0;i<tree.length;i++) {
            this.addTree(tree[i],parentEl);
        }
        return;
    }
    if (!tree.text && tree.children.length == 0) return;

    // this.searchIndex.add({
    //     id: tree.uid,
    //     item: tree.item,
    //     text: tree.text
    // });

    parentEl = parentEl || this.parentEl;
    var $children = this.renderNode(tree, parentEl);
    
    if (tree.children.length > 0) {    
        this.addTree(tree.children, $children);
    }
};
