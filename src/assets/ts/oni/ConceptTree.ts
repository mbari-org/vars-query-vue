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
export interface Taxa {
  name: string;
  rank?: string;
}

export interface TaxaNode extends Taxa {
  alternativeNames?: string[];
  children?: TaxaNode[];
}

export function accumulateNamesFromTaxaNodes(nodes: TaxaNode[]): string[] {
    const acc = [] as string[];
    nodes.forEach((node) => accumulateNamesFromTaxaNode(node, acc));
    return [...new Set(acc)].sort()
}

export function accumulateNamesFromTaxaNode(node: TaxaNode, names: string[] = []): string[] {
  names.push(node.name);
  names.push(...(node.alternativeNames || []));
  if (node.children) {
    node.children.forEach((child) => accumulateNamesFromTaxaNode(child, names));
  }
  return names;
}


/** ****************************************************************************
 * Extract the last concept node in a branch
 * @param node The root or concept. Should have a `children` property
 * @returns {{children}|*}
 */
function terminalNode(node: TaxaNode): TaxaNode {
  if (!node.children || node.children.length === 0) {
    return node;
  }
  else {
    return terminalNode(node.children[0]);
  }
}

/** ****************************************************************************
 * Trims a branch to the number of levels set by `maxItems`. This returns
 * a branch from the terminal node up to `maxItems`.
 * @param node
 * @param maxItems
 * @param queue
 * @returns {*}
 */
function trimmer(node: TaxaNode, maxItems: number, queue: TaxaNode[] = []): TaxaNode {
  queue.push(node);
  if (queue.length > maxItems) {
    queue.shift();
  }
  if (node && node.children && node.children.length > 0) {
    return trimmer(node.children[0], maxItems, queue);
  }
  else {
    return queue[0];
  }
}

/** ****************************************************************************
 * Flattens a heirarchy branch
 * @param node
 * @param queue
 * @returns {*|*[]}
 */
function flatten(node: TaxaNode, queue: TaxaNode[] = []): TaxaNode[] {
  queue.push(node);
  if (node && node.children && node.children.length > 0) {
    return flatten(node.children[0], queue);
  }
  else {
    return queue;
  }
}

/** ****************************************************************************
 * Extentions methods for a KB taxa tree.
 **************************************************************************** */
 export class TreeExt {
  tree: TaxaNode;

  constructor(tree: TaxaNode) {
    this.tree = tree;
  }

  terminal(): TaxaNode {
    return terminalNode(this.tree);
  }

  trim(levelsUp: number): TaxaNode {
    return trimmer(this.tree, levelsUp);
  }

  trimAndFlatten(levelsUp: number): TaxaNode[] {
    const subtree = this.trim(levelsUp);
    return flatten(subtree);
  }
}
