/**
 * Copyright 2017 Monterey Bay Aquarium Research Institute
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import type { Count, GeoImage } from "@/assets/ts/fathomnet/GeoImage";
import type { Region } from '@/assets/ts/fathomnet/Region'

const fathomnetUrl = "https://database.fathomnet.org/api";
const fathomnetEndpoints = {
  boundingBoxes: {
    count: fathomnetUrl + "/boundingboxes/count",
    delete: fathomnetUrl + "/boundingboxes/", // {uuid}
    listConcepts: fathomnetUrl + "/boundingboxes/list/concepts",
    listCounts: fathomnetUrl + "/boundingboxes/list/counts",
    listObservers: fathomnetUrl + "/boundingboxes/list/observers",
    countByConcept: fathomnetUrl + "/boundingboxes/query/count/", // {concept}
    update: fathomnetUrl + "/boundingboxes/", // {uuid} PUT or POST with no UUID and JSON body
    uploadCsv: fathomnetUrl + "/boundingboxes/upload/csv", // POST
  },
  darwincores: {
    listOwnerInstitutions: fathomnetUrl + "/darwincore/list/ownerinstitutions",
  },
  firebase: {
    auth: fathomnetUrl + "/firebase/auth", // POST
  },
  geoimages: {
    query: fathomnetUrl + "/geoimages/query", // look at swagger. Many possible query params
    count: fathomnetUrl + "/geoimages/count", // look at swagger. Many possible query params
    imageForUpload: fathomnetUrl + "/geoimages/query/imagesetupload/", // {imageSetUploadUuid}
  },
  images: {
    count: fathomnetUrl + "/images/count",
    countByContributor: fathomnetUrl + "/images/query/count/contributor/", // {contributor}
    get: fathomnetUrl + "/images/", // {imageUuid}
    listContributors: fathomnetUrl + "/images/list/contributors",
    listImagingTypes: fathomnetUrl + "/images/list/imagingtypes",
    queryByConcept: fathomnetUrl + "/images/query/concept/", // {concept}
    queryByContributor: fathomnetUrl + "/images/query/contributor/", // {contributorEmail}
    queryByObserver: fathomnetUrl + "/images/query/observer/", // {observer}
    queryByTag: fathomnetUrl + "/images/query/tags", // {?key, ?value}
    queryByUuids: fathomnetUrl + "/images/query/uuids", // POST with Json body of Array[UUID]
  },
  imageSetUploads: {
    count: fathomnetUrl + "/imagesetuploads/count",
    list: fathomnetUrl + "/imagesetuploads/list/all", // ?size=20&page=1&sort=timestamp
    listContributors: fathomnetUrl + "/imagesetuploads/count/contributors",
    listRejectionReasons: fathomnetUrl + "/imagesetuploads/list/rejectionreasons",
    queryByContributor: fathomnetUrl + "/imagesetuploads/query/contributor/", // {contributorsEmail
    queryByImageUuid: fathomnetUrl + "/imagesetuploads/query/image/", // {imageUuid}
    queryByUuid: fathomnetUrl + "/imagesetuploads/", // {uuid}
    stats: fathomnetUrl + "/imagesetuploads/stats/", // {imageSetUploadUuid}
  },
  regions: {
    all: fathomnetUrl + "/regions",
  },
  stats: {
    popularSearches: fathomnetUrl + "/stats/list/popular/searches",
  },
  taxa: {
    listProviders: fathomnetUrl + "/taxa/list/providers",
    queryTaxa: fathomnetUrl + "/taxa/query/", // {providerName}/{concept}
    queryChildren: fathomnetUrl + "/taxa/query/children/", // {providerName}/{concept}
    queryParent: fathomnetUrl + "/taxa/query/parent/", // {providerName}/{concept}
  },
  users: {
    apikey: fathomnetUrl + "/users/apikey",
    count: fathomnetUrl + "/users/count",
    list: fathomnetUrl + "/users", // ?number=0&size=5
    listRoles: fathomnetUrl + "/users/list/roles",
    listExpertise: fathomnetUrl + "/users/list/expertise",
    query: fathomnetUrl + "/users/query", // Requires a valid auth token from firebase/auth as Authorization header
    queryEmail: fathomnetUrl + "/users/query/email/",
    update: fathomnetUrl + "/users/",
    updateByAdmin: fathomnetUrl + "/users/admin/", // {uuid}
  },
};


/**
 *  See http://fathomnet.org:8080/swagger-ui#/default/findUsingGet for list of params
 * @param queryParams JSON object of query parameters
 * @returns {Promise<Response>}
 */
export function geoimageQuery(conceptName: string): Promise<GeoImage[]> {
  return fetch(fathomnetEndpoints.geoimages.query, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({ concept: conceptName})
  }).then((r) => r.json());
}

export function imageCount(conceptName: string): Promise<Count> {
  return fetch(fathomnetEndpoints.geoimages.count, {
    method: 'Post',
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({ concept: conceptName, taxaProviderName: "mbari" }),
  }).then((r) => r.json());

}

export function listRegions(): Promise<Region[]> {
    return fetch(fathomnetEndpoints.regions.all, {
        mode: "cors",
    }).then((r) => r.json());
}
