def convert_quotes_file(input_file, output_file):
    # Read the input file
    with open(input_file, 'r', encoding='utf-8') as f:
        quotes = f.readlines()

    # Prepare the header
    header = """---
name: Quotes
description: Collection of memorable quotes and thoughts
color: #4A90E2
---

"""
    
    # Process each quote
    formatted_quotes = []
    current_quote = ""
    
    for line in quotes:
        line = line.strip()
        if line:  # If line is not empty
            # Start a new quote
            if current_quote:
                # Format previous quote
                formatted_quotes.append(f"T: Quote\nD: {current_quote}\n")
            current_quote = line
        
    # Add the last quote
    if current_quote:
        formatted_quotes.append(f"T: Quote\nD: {current_quote}\n")

    # Write to output file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(header)
        f.write('\n'.join(formatted_quotes))

# Run the conversion
convert_quotes_file('notes-learner/src/data/topics/quotes.md', 
                   'notes-learner/src/data/topics/quotes_formatted.md') 