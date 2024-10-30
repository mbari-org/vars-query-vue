export function tabDelimitedParser(data: string): Array<Array<string>> {
  return data.split("\n").map((line) => line.split("\t"));
}
