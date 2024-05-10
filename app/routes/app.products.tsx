import { Card, Layout, Page } from "@shopify/polaris"

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
   const {admin} =  await authenticate.admin(request);
   
   const response = await admin.graphql(
    `#graphql
      {
        shop {
            name
        }
	products(first: 10) {
		edges {
      node {
        id
        title
        
      }
    }
	}
}`
  );
  const responseJson = await response.json();

  return json({
    products: responseJson.data?.products?.edges,
    shop: responseJson.data?.shop,
  });

};

const Products = () => {

    const data = useLoaderData<typeof loader>();

    console.log(data);
  return (
    <div>
        <Page>
            <Layout>
                <Layout.Section>
                    <Card>
                        <h1>Product Page</h1>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    </div>
  )
}

export default Products