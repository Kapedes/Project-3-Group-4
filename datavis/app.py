from flask import Flask, render_template
import pandas as pd
import plotly.express as px
import sqlite3 as sql

app = Flask(__name__)

# Connect to the SQLite database
conn = sql.connect('movie.sqlite', check_same_thread=False)

@app.route('/')
def index():
    # Read data directly into a pandas DataFrame
    query = """
    SELECT Title, CVotesMale, CVotesFemale, CVotesU18M, CVotesU18F, CVotes45AM, CVotes45AF 
    FROM IMDB
    """
    df_votes = pd.read_sql_query(query, conn)

    # Convert vote columns to numeric
    vote_columns = ['CVotesMale', 'CVotesFemale', 'CVotesU18M', 'CVotesU18F', 'CVotes45AM', 'CVotes45AF']
    df_votes[vote_columns] = df_votes[vote_columns].apply(pd.to_numeric)

    # Select top 10 movies based on total votes
    df_votes['TotalVotes'] = df_votes[vote_columns].sum(axis=1)
    df_top10 = df_votes.nlargest(10, 'TotalVotes')

    # Create a stacked bar chart using Plotly Express
    fig = px.bar(df_top10, x='Title', y=vote_columns, barmode='stack',
                 labels={'value': 'Number of Votes', 'variable': 'Gender Category'},
                 title='Gender-based Voting Analysis')

    # Render the template with the plot
    return render_template('index.html', plot=fig.to_html(full_html=False))

if __name__ == '__main__':
    app.run(debug=True)