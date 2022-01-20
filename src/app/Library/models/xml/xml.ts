export interface XMLFile {
  declaration: XMLDeclaration;
  elements: XMLNode[];
}

export interface XMLDeclaration {
  attributes: {
    encoding?: string;
    version?: string;
    standalone?: string;
  };
}

export interface XMLNode {
  name: string;
  attributes?: XMLAttributes;
  elements?: XMLNode[];
  type?: 'element' | 'instruction' | 'comment' | 'cdata' | undefined;
}

export interface XMLAttributes {
  [name: string]: string;
}
