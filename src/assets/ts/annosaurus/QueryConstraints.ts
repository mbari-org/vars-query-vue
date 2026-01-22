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
export interface QueryConstraints {
  concepts?: string[];
  video_reference_uuids?: string[];
  observers?: string[];
  groups?: string[];
  activities?: string[];
  min_depth?: number;
  max_depth?: number;
  min_lat?: number;
  max_lat?: number;
  min_lon?: number;
  max_lon?: number;
  min_timestamp?: string;
  max_timestamp?: string;
  link_name?: string;
  link_value?: string;
  mission_contacts?: string[];
  platform_name?: string;
  mission_id?: string;
  limit?: number;
  offset?: number;
  data?: boolean;
}

export function isSearchable(q: QueryConstraints): boolean {
  return ((q.video_reference_uuids !== undefined && q.video_reference_uuids.length > 0) ||
    (q.concepts !== undefined && q.concepts.length > 0) ||
    (q.observers !== undefined && q.observers.length > 0) ||
    (q.groups !== undefined && q.groups.length > 0) ||
    (q.activities !== undefined && q.activities.length > 0) ||
    q.min_depth !== undefined ||
    q.max_depth !== undefined ||
    q.min_lat !== undefined ||
    q.max_lat !== undefined ||
    q.min_lon !== undefined ||
    q.max_lon !== undefined ||
    q.min_timestamp !== undefined ||
    q.max_timestamp !== undefined
  );
}

export function minify(q: QueryConstraints): Record<string, unknown> {
  return Object.entries(q)
    .filter(([, value]) => !!value)
    .filter(
      ([, value]) =>
        typeof value != "object" ||
        Array.isArray(value) ||
        Object.keys(value).length > 0
    )
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}

export function newEmptyQueryConstraint(): QueryConstraints {
  return {
    video_reference_uuids: [],
    concepts: [],
    observers: [],
    groups: [],
    activities: [],
    mission_contacts: [],
    limit: 5000,
    offset: 0,
    data: true,
  };
}
