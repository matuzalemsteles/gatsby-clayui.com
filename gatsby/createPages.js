'use strict';

const path = require("path");

module.exports = async ({ boundActionCreators, graphql }) => {
	const { createPage } = boundActionCreators;

	const docsPostTemplate = path.resolve(__dirname, '../src/templates/docs.js');

	return graphql(`
		{
			allMarkdownRemark(limit: 1000) {
				edges {
					node {
						fields {
							slug
						}
					}
				}
			}
		}
	`).then(result => {
		if (result.errors) {
			return Promise.reject(result.errors);
		}

		result.data.allMarkdownRemark.edges.forEach(({ node }) => {
			const { slug } = node.fields;

			if (slug.includes('docs/')) {
				createPage({
					path: slug,
					component: docsPostTemplate,
					context: {
						slug,
					},
				});
			}
		});
	});
};