function $_global_sputils_termstore () {
  (function (window, $) {
    'use strict';

    var getTaxonomyTerms = function (termSetId) {
      var deferred = $.Deferred();
      var taxonomyLoaded = !!window.SP && !!window.SP.Taxonomy;

      var getTaxonomyTerms_ = function () {
        var ctx = SP.ClientContext.get_current(),
            taxonomySession = SP.Taxonomy.TaxonomySession.getTaxonomySession(ctx),
            termStore = taxonomySession.getDefaultSiteCollectionTermStore(),
            termSet = termStore.getTermSet(termSetId),
            terms = termSet.getAllTerms();

        ctx.load(terms);
        ctx.executeQueryAsync(function () {
          if (!terms) {
            return deferred.reject()
          }

          var termsEnumerator = terms.getEnumerator(),
              t = {};

          while (termsEnumerator.moveNext()) {
            var currentTerm = termsEnumerator.get_current();
            t[currentTerm.get_name()] = currentTerm.get_id().toString();
          }

          deferred.resolve(t);
        }, function () {
          deferred.reject();
        });
      };

      if (taxonomyLoaded) {
        getTaxonomyTerms_();
      } else {
        SP.SOD.registerSod('sp.taxonomy.js', SP.Utilities.Utility.getLayoutsPageUrl('sp.taxonomy.js'));
        SP.SOD.executeFunc('sp.taxonomy.js', null, getTaxonomyTerms_);
      }

      return deferred;
    };

    window.sputils = window.sputils || {};
    window.sputils.termstore = {
      getTaxonomyTerms: getTaxonomyTerms
    };
  })(window, jQuery);
}
$_global_sputils_termstore();
