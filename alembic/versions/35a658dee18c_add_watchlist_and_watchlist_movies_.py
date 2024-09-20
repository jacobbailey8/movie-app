"""add watchlist and watchlist_movies tables

Revision ID: 35a658dee18c
Revises: 2002ba105d97
Create Date: 2024-09-19 22:29:24.994441

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '35a658dee18c'
down_revision: Union[str, None] = '2002ba105d97'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# revision identifiers, used by Alembic.
revision = '35a658dee18c'
down_revision = '2002ba105d97'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Ensure that 'show_id' in 'movies' table is unique
    op.alter_column('movies', 'show_id',
                    existing_type=sa.Integer(), nullable=False)
    op.create_unique_constraint('uq_movies_show_id', 'movies', ['show_id'])

    # Create the 'watchlists' table
    op.create_table(
        'watchlists',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('name', sa.String, nullable=False),
        sa.Column('user_id', sa.Integer, sa.ForeignKey(
            'users.id'), nullable=False),
        sa.Column('created_at', sa.Date, nullable=False),
        sa.Column('last_updated', sa.Date, nullable=False)
    )

    # Create the association table 'watchlist_movies'
    op.create_table(
        'watchlist_movies',
        sa.Column('watchlist_id', sa.Integer, sa.ForeignKey(
            'watchlists.id'), primary_key=True),
        sa.Column('movie_id', sa.Integer, sa.ForeignKey(
            'movies.show_id'), primary_key=True)
    )


def downgrade() -> None:
    # Drop the 'watchlist_movies' table
    op.drop_table('watchlist_movies')

    # Drop the 'watchlists' table
    op.drop_table('watchlists')

    # Remove the unique constraint from 'movies'
    op.drop_constraint('uq_movies_show_id', 'movies', type_='unique')
