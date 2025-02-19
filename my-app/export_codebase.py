import os
import json
import argparse

def is_relevant_line(line):
    """
    Determines if a line contains information relevant for Mantine migration.
    """
    relevant_patterns = [
        'import', 
        'export',
        'function',
        'interface',
        'type',
        '@',  # For decorators
        'shadcn',
        'mantine',
        'component',
        'props',
        'styled',
        'theme',
        'css',
        'className',
        'style'
    ]
    return any(pattern in line.lower() for pattern in relevant_patterns)

def extract_component_info(file_path):
    """
    Extracts component structure, imports, and styling relevant for Mantine migration.
    """
    component_info = {
        'imports': [],
        'component_structure': [],
        'styling': [],
        'props': []
    }
    
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            in_component = False
            current_block = []
            
            for line in file:
                line = line.strip()
                
                # Track imports
                if line.startswith('import'):
                    component_info['imports'].append(line)
                
                # Track component definition
                elif 'function' in line or 'class' in line:
                    in_component = True
                    current_block = [line]
                
                # Track props interface/type
                elif line.startswith('interface') or line.startswith('type'):
                    component_info['props'].append(line)
                
                # Track styling
                elif any(style_term in line.lower() for style_term in ['style', 'css', 'theme', 'classname']):
                    component_info['styling'].append(line)
                
                # Collect component structure
                if in_component and line:
                    current_block.append(line)
                    if line.startswith('}'):
                        component_info['component_structure'].extend(current_block)
                        in_component = False
                        current_block = []
                
        return component_info
    except Exception as e:
        return f"Error processing {file_path}: {str(e)}"

def export_codebase(root_dir, output_file):
    """
    Traverses the codebase and exports relevant component information to JSONL.
    """
    with open(output_file, 'w', encoding='utf-8') as out_file:
        for subdir, _, files in os.walk(root_dir):
            for file in files:
                if file.endswith(('.tsx', '.ts', '.jsx', '.js')):
                    file_path = os.path.join(subdir, file)
                    relative_path = os.path.relpath(file_path, root_dir)
                    
                    # Skip node_modules and build directories
                    if 'node_modules' in relative_path or 'build' in relative_path:
                        continue
                    
                    component_info = extract_component_info(file_path)
                    if component_info:
                        json_line = json.dumps({
                            'file_path': relative_path,
                            'component_info': component_info
                        })
                        out_file.write(json_line + '\n')

def main():
    parser = argparse.ArgumentParser(
        description="Export front-end components for Mantine migration analysis"
    )
    parser.add_argument(
        "--root", 
        required=True, 
        help="Root directory of the codebase"
    )
    parser.add_argument(
        "--output", 
        default="mantine_migration_export.jsonl",
        help="Output JSONL file path"
    )

    args = parser.parse_args()
    export_codebase(args.root, args.output)
    print(f"Export completed: {args.output}")

if __name__ == "__main__":
    main() 